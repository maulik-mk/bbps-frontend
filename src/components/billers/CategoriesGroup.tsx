import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';

export interface Service {
    name: string;
    icon: string;
}

export interface CategoriesGroupProps {
    title: string;
    services: Service[];
}

export const CategoriesGroup: React.FC<CategoriesGroupProps> = ({ title, services }) => {
    const navigate = useNavigate();

    return (
        <div className="col-12 mb-2">
            <h5 className="font-bold text-900 mb-4 ml-2">{title}</h5>
            <div className="grid">
                {services.map((service, index) => (
                    <Card key={index} name={service.name} icon={service.icon} onClick={() => navigate(`/bbps/category/${encodeURIComponent(service.name)}`)} />
                ))}
            </div>
        </div>
    );
};
