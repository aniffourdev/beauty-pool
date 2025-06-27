import React, { useState, useRef, useEffect } from 'react';

interface SubService {
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface ParentService {
  name: string;
  description: string;
  sub_services: SubService[];
}

interface Service {
  id: string;
  parent_service: ParentService;
}

interface NavTabsProps {
  services: Service[];
}

const Services: React.FC<NavTabsProps> = ({ services }) => {
  const [activeTab, setActiveTab] = useState(services[0]?.id || '');
  const [isAnimating, setIsAnimating] = useState(false);
  const tabContentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab || isAnimating) return;

    setIsAnimating(true);

    if (tabContentRef.current) {
      tabContentRef.current.classList.add('animate-tab-out');

      setTimeout(() => {
        setActiveTab(tabId);
        tabContentRef.current?.classList.remove('animate-tab-out');
        tabContentRef.current?.classList.add('animate-tab-in');

        setTimeout(() => {
          tabContentRef.current?.classList.remove('animate-tab-in');
          setIsAnimating(false);
        }, 300);
      }, 300);
    } else {
      setActiveTab(tabId);
    }
  };

  useEffect(() => {
    console.log("Services Component Received:", services);
  }, [services]);

  return (
    <div className="tabs w-full max-w-4xl">
      <style jsx>{`
        @keyframes tabOut {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        @keyframes tabIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-tab-out {
          animation: tabOut 0.3s ease-out forwards;
        }
        .animate-tab-in {
          animation: tabIn 0.3s ease-in forwards;
        }
        .tabs-container {
          overflow-x: auto;
          white-space: nowrap;
        }
        .tab-button {
          display: inline-block;
          white-space: nowrap;
        }
      `}</style>

      <div className="tabs-container">
        <ul className="flex flex-wrap transition-all duration-300 w-full gap-2 overflow-x-auto">
          {services.map((service) => (
            <li key={service.id} className="flex-shrink-0">
              <button
                onClick={() => handleTabChange(service.id)}
                className={`
                  tab-button py-1.5 pt-[5px] px-3 text-sm md:text-base md:px-3 text-black
                  hover:text-gray-800 font-semibold whitespace-nowrap
                  ${activeTab === service.id
                    ? 'bg-[#ffe8e3] text-black rounded-full'
                    : ''
                  }
                `}
                role="tab"
                aria-selected={activeTab === service.id}
              >
                {service.parent_service.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3">
        {services.map((service) => (
          <div
            key={service.id}
            ref={activeTab === service.id ? tabContentRef : null}
            id={service.id}
            role="tabpanel"
            className={`${activeTab === service.id ? '' : 'hidden'}`}
            aria-labelledby={`tabs-with-pill-item-${service.id.slice(-1)}`}
          >
            {service.parent_service.sub_services.map((subService, index) => (
              <div key={index} className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{subService.name}</h2>
                  <p className="text-gray-500 text-sm mt-0.5">{subService.description}</p>
                  <p className="text-lg font-semibold mt-3 text-[#f47c66]">
                    {subService.price} $
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">{subService.duration} minutes</p>
                </div>
                <button className="border rounded-full px-4 py-2 text-sm font-semibold bg-slate-900 text-slate-100 duration-300 transition-all hover:text-slate-900 hover:bg-gray-100">
                  Book now
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
