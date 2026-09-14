import React, { useEffect, useState } from 'react';
import { CategoriesGroup } from '../../../components/billers/CategoriesGroup';
import { CategoriesGroupProps } from '../../../components/billers/CategoriesGroup';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { BBPSLogo } from '../../../components/BBPSLogo';

const Categories = () => {
    const [billerCategories, setBillerCategories] = useState<CategoriesGroupProps[]>([]);

    useEffect(() => {
        fetch('/data/billers.json')
            .then((res) => res.json())
            .then((data) => setBillerCategories(data))
            .catch((err) => console.error('Error loading billers:', err));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="flex flex-column md:flex-row md:align-items-center justify-content-between mb-4 pb-3 border-bottom-1 border-300">
                    <div>
                        <h2 className="m-0 text-900 font-bold text-2xl">Bharat Connect Billers</h2>
                    </div>
                    <div>
                        <BBPSLogo type="bharat_connect" className="mt-3 md:mt-0" />
                    </div>
                </div>
            </div>

            {billerCategories.map((category, index) => (
                <CategoriesGroup key={index} title={category.title} services={category.services} />
            ))}
        </div>
    );
};

export default Categories;
