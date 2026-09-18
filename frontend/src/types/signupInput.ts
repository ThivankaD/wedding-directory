export interface CategoryProps {
    onCategoryChange: (category: string) => void;
    value?: string;
}

export interface CityProps {
    onCityChange: (category: string) => void;
    placeholder: string;
    className?: string;
    value?: string;
}

export interface LocationProps {
    onLocationChange: (category: string) => void;
    disabled?: boolean;
    placeholder: string;
    className?: string;
}

export interface VisitorSignupProps {
    isVisible: boolean;
    onClose: () => void;
}