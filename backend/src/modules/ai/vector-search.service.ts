import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from '../../database/entities/vendor.entity';
import { ServiceEntity } from '../../database/entities/service.entity';
import { PackageEntity } from '../../database/entities/package.entity';
import { EmbeddingsService } from './embeddings.service';

interface SearchResult {
  id: string;
  name: string;
  similarity: number;
  content: string;
  type: 'vendor' | 'service' | 'package';
  details: {
    location?: string;
    city?: string;
    category?: string;
    pricing?: number;
    features?: string[];
  };
}

@Injectable()
export class VectorSearchService {
  constructor(
    @InjectRepository(VendorEntity)
    private vendorRepository: Repository<VendorEntity>,
    @InjectRepository(ServiceEntity)
    private serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(PackageEntity)
    private packageRepository: Repository<PackageEntity>,
    private embeddingsService: EmbeddingsService,
  ) {}

  async search(query: string, limit = 5): Promise<SearchResult[]> {
    const queryEmbedding = await this.embeddingsService.generateEmbedding(query);
    
    // Format the embedding array as a PostgreSQL vector string
    const formattedEmbedding = `[${queryEmbedding.join(',')}]`;

    // Search for relevant vendor data
    const vendorResults = await this.vendorRepository.query(`
      SELECT 
        v.id, 
        v.business_name as name,
        v.about,
        v.location,
        v.city,
        e.content,
        1 - (e.embedding <=> $1::vector) as similarity
      FROM vendor v
      JOIN vendor_embeddings e ON v.id = e.id
      ORDER BY similarity DESC
      LIMIT $2
    `, [formattedEmbedding, limit]);

    // Search for relevant service data
    const serviceResults = await this.serviceRepository.query(`
      SELECT 
        o.id,
        o.name,
        o.description,
        o.category,
        v.business_name as vendor_name,
        v.location,
        v.city,
        e.content,
        1 - (e.embedding <=> $1::vector) as similarity
      FROM service o
      JOIN offering_embeddings e ON o.id = e.id
      JOIN vendor v ON o.vendor_id = v.id
      ORDER BY similarity DESC
      LIMIT $2
    `, [formattedEmbedding, limit]);

    // Search for relevant package data
    const packageResults = await this.packageRepository.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.pricing,
        o.name as offering_name,
        o.category,
        v.business_name as vendor_name,
        v.location,
        v.city,
        e.content,
        1 - (e.embedding <=> $1::vector) as similarity
      FROM package p
      JOIN package_embeddings e ON p.id = e.id
      JOIN service o ON p.service_id = o.id
      JOIN vendor v ON o.vendor_id = v.id
      ORDER BY similarity DESC
      LIMIT $2
    `, [formattedEmbedding, limit]);

    const formatResults = (results, type: 'vendor' | 'service' | 'package'): SearchResult[] => {
      return results.map(r => ({
        id: r.id,
        name: r.name || r.business_name,
        similarity: r.similarity,
        type,
        content: this.formatContent(r, type),
        details: {
          location: r.location,
          city: r.city,
          category: r.category,
          pricing: r.pricing,
          features: r.features,
        }
      }));
    };

    // Combine and sort results
    const allResults = [
      ...formatResults(vendorResults, 'vendor'),
      ...formatResults(serviceResults, 'service'),
      ...formatResults(packageResults, 'package'),
    ].sort((a, b) => b.similarity - a.similarity);

    // Take the top results
    return allResults.slice(0, limit);
  }

  private formatContent(result, type: string): string {
    switch (type) {
      case 'vendor':
        return `${result.name} (${result.city}, ${result.location})\n${result.about}`;
      case 'service':
        return `${result.vendor_name} - ${result.name}\nCategory: ${result.category}\n${result.description}`;
      case 'package':
        return `${result.vendor_name} - ${result.offering_name} - ${result.name}\n` +
               `Price: $${result.pricing}\n${result.description}\n` +
               `Features: ${result.features?.join(', ')}`;
      default:
        return result.content;
    }
  }
}