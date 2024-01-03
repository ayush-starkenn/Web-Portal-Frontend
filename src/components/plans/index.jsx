import React from "react";

const PlanCard = ({ plans }) => {
  return (
    <section className="dark:bg-dark relative overflow-hidden">
      <div className="container mx-auto">
        <div className="-mx-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-3 3xl:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanCard;

const PricingCard = ({
  children,
  description,
  price,
  type,
  subscription,
  items,
}) => {
  return (
    <>
      <div className="w-full px-4">
        <div className="border-stroke shadow-pricing dark:border-dark-3 dark:bg-dark-2 relative mb-4 overflow-hidden rounded-lg border-2 bg-white px-8 dark:border-navy-800 dark:bg-gray-900 dark:text-gray-150 sm:p-12 lg:px-6 lg:py-10 xl:p-[50px]">
          <div className="ribbon-wrap">
            <div className="ribbon">{type}</div>
          </div>
          <h2 className="text-dark mb-5 text-[36px] font-bold dark:text-white">
            ₹&nbsp;{price}
            <span className="text-body-color dark:text-dark-6 text-base font-medium">
              / {subscription}
            </span>
          </h2>
          <p className="border-stroke text-body-color dark:text-dark-6 mb-4 border-b pb-4 text-justify text-lg dark:border-gray-700">
            {description}
          </p>
          {items.map((item, index) => (
            <p
              key={index}
              className="text-body-color dark:text-dark-6 mb-2 flex pr-2"
            >
              <span className="flex items-start">
                <i className="pi pi-check-circle mr-2 mt-1 text-green-500"></i>
                <span className="text-justify">{item}</span>
              </span>
            </p>
          ))}

          {children && (
            <div className="mb-4 flex flex-col gap-[14px]">{children}</div>
          )}

          <div className="flex justify-center">
            <a
              href="/#"
              className={` 
                border-primary bg-primary border-stroke bg-transparent text-primary dark:border-dark-3 mt-8 block w-fit rounded-md border border-blue-600 px-4 py-2 text-center
                text-base font-medium text-blue-600 transition hover:border-blue-400 hover:bg-blue-600 hover:bg-opacity-90  hover:text-white dark:text-gray-50
             `}
            >
              Choose {type}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
