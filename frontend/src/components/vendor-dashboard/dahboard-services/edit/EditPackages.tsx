"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { FIND_PACKAGES_BY_OFFERING } from "@/graphql/queries";
import { UPDATE_PACKAGE, DELETE_PACKAGE, CREATE_PACKAGE } from "@/graphql/mutations";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Package {
  id?: string;
  name: string;
  description: string;
  pricing: number;
  features: string[];
  offeringId?: string;
  visible: boolean;
  requiresReservation: boolean;
}

const EditPackages: React.FC = () => {
  const params = useParams();
  const offeringId = params.id as string;

  const { loading, error, data } = useQuery(FIND_PACKAGES_BY_OFFERING, {
    variables: { offeringId },
  });

  const [packages, setPackages] = useState<Package[]>([]);

  const [createPackage] = useMutation(CREATE_PACKAGE);
  const [updatePackage] = useMutation(UPDATE_PACKAGE);
  const [deletePackage] = useMutation(DELETE_PACKAGE);

  useEffect(() => {
    if (data?.findPackagesByOffering) {
      setPackages(data.findPackagesByOffering);
    }
  }, [data]);

  const handlePackageChange = (
    index: number,
    field: keyof Package,
    value: string
  ) => {
    const updatedPackages = [...packages];

    if (field === "pricing") {
      updatedPackages[index] = {
        ...updatedPackages[index],
        pricing: parseFloat(value) || 0,
      };
    } else {
      updatedPackages[index] = {
        ...updatedPackages[index],
        [field]: value,
      };
    }

    setPackages(updatedPackages);
  };

  const handleFeatureChange = (
    packageIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const updatedPackages = [...packages];
    updatedPackages[packageIndex].features[featureIndex] = value;
    setPackages(updatedPackages);
  };

  const addFeature = (packageIndex: number) => {
    const updatedPackages = [...packages];
    updatedPackages[packageIndex].features.push("");
    setPackages(updatedPackages);
  };

  const handleVisibilityChange = (packageIndex: number, visible: boolean) => {
    const updatedPackages = [...packages];
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      visible,
    };
    setPackages(updatedPackages);
  };

  const handleRequiresReservationChange = (
    packageIndex: number,
    requiresReservation: boolean
  ) => {
    const updatedPackages = [...packages];
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      requiresReservation,
    };
    setPackages(updatedPackages);
  };

  const handleSavePackage = async (pkg: Package) => {
    try {
      const validFeatures = pkg.features.filter((f) => f.trim() !== "");

      if (!pkg.id) {
        const result = await createPackage({
          variables: {
            input: {
              name: pkg.name.trim(),
              description: pkg.description.trim(),
              pricing: pkg.pricing,
              features: validFeatures,
              visible: pkg.visible,
              requiresReservation: pkg.requiresReservation,
            },
            offeringId,
          },
        });

        if (result.data?.createPackage) {
          toast.success("Package created successfully!");
          setPackages((prev) =>
            prev.map((p) => (p === pkg ? result.data.createPackage : p))
          );
        }
      } else {
        const result = await updatePackage({
          variables: {
            input: {
              id: pkg.id,
              name: pkg.name.trim(),
              description: pkg.description.trim(),
              pricing: pkg.pricing,
              features: validFeatures,
              visible: pkg.visible,
              requiresReservation: pkg.requiresReservation,
            },
          },
        });

        if (result.data?.updatePackage) {
          toast.success("Package updated successfully!");
          setPackages((prev) =>
            prev.map((p) =>
              p.id === pkg.id ? result.data.updatePackage : p
            )
          );
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to save package: ${errorMessage}`);
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      const result = await deletePackage({ variables: { id: packageId } });

      if (result.data?.deletePackage) {
        toast.success("Package deleted successfully!");
        setPackages((prev) => prev.filter((p) => p.id !== packageId));
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete package: ${errorMessage}`);
    }
  };

  const addNewPackage = () => {
    setPackages((prev) => [
      ...prev,
      {
        name: `Package ${prev.length + 1}`,
        description: "",
        pricing: 0,
        features: [""],
        offeringId,
        visible: false,
        requiresReservation: false,
      },
    ]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Fragment>
      <div className="bg-white rounded-2xl p-4 px-8 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="font-title text-[30px]">Packages</h2>
          <Button onClick={addNewPackage}>Add New Package</Button>
        </div>

        <hr className="my-4" />

        {packages.map((pkg, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3>{pkg.name}</h3>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label>Visible</label>
                  <Switch
                    checked={pkg.visible}
                    onCheckedChange={(checked) =>
                      handleVisibilityChange(index, checked)
                    }
                  />
                </div>

                {pkg.id && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeletePackage(pkg.id!)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>

            <Input
              value={pkg.name}
              onChange={(e) =>
                handlePackageChange(index, "name", e.target.value)
              }
              placeholder="Name"
            />

            <Input
              value={pkg.description}
              onChange={(e) =>
                handlePackageChange(index, "description", e.target.value)
              }
              placeholder="Description"
              className="mt-2"
            />

            <Input
              type="number"
              value={pkg.pricing}
              onChange={(e) =>
                handlePackageChange(index, "pricing", e.target.value)
              }
              className="mt-2"
            />

            <div className="flex items-center gap-2 mt-3">
              <label>Requires Reservation?</label>
              <Switch
                checked={pkg.requiresReservation}
                onCheckedChange={(checked) =>
                  handleRequiresReservationChange(index, checked)
                }
              />
            </div>

            <div className="mt-3">
              {pkg.features.map((feature, fIndex) => (
                <Input
                  key={fIndex}
                  value={feature}
                  onChange={(e) =>
                    handleFeatureChange(index, fIndex, e.target.value)
                  }
                  className="mt-2"
                  placeholder="Feature"
                />
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => addFeature(index)}>
                Add Feature
              </Button>
              <Button onClick={() => handleSavePackage(pkg)}>
                {pkg.id ? "Update Package" : "Create Package"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default EditPackages;
