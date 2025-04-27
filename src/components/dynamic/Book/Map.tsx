"use client";
import React, { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { IoStar } from "react-icons/io5";

interface Article {
  featured_image: string;
  id: string;
  label: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  services?: { name: string; price: number }[];
}

interface MapProps {
  articles: Article[];
  currentLocation: { latitude: number; longitude: number };
  userLocation: string | null; // Allow userLocation to be null
}

const MapComponent: React.FC<MapProps> = ({
  articles,
  currentLocation,
  userLocation,
}) => {
  const [selected, setSelected] = useState<Article | null>(null);

  return (
    <div className="booking-result h-screen">
      {currentLocation && (
        <Map
          initialViewState={{
            longitude: currentLocation.longitude,
            latitude: currentLocation.latitude,
            zoom: 4, // Adjust the zoom level to see the entire country
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken="pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"
        >
          {articles.map((article) => (
            <Marker
              key={article.id}
              longitude={article.longitude}
              latitude={article.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelected(article);
              }}
            >
              <div className="h-11 w-11 bg-cover bg-center" style={{ backgroundImage: `url(https://luxeenbois.com/assets/12247141-da04-4eb2-bff5-205417bc924b?cache-buster=2024-12-07T13:14:36.000Z&key=system-large-contain)` }}>
                <div className="flex justify-center text-center items-center flex-col bg-[#dd0067dc] h-5 w-5 rounded-full absolute left-[12px] top-[7px]">
                  <span className="text-xs font-bold text-white -mb-0.5">5.0</span>
                  <span><IoStar className="size-3 text-amber-200" /></span>
                </div>
              </div>
            </Marker>
          ))}

          {selected && (
            <Link href={`/a/${selected.slug}`}>
              <Popup
                longitude={selected.longitude}
                latitude={selected.latitude}
                onClose={() => setSelected(null)}
                closeOnClick={false}
                className="cursor-pointer"
              >
                <div>
                  <img
                    src={`https://luxeenbois.com/assets/${selected.featured_image}`}
                    alt={selected.label}
                    className="mb-1"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px 8px 0px 0px",
                    }}
                  />
                  <h3 className="text-lg font-semibold pl-3 mt-3">
                    {selected.label}
                  </h3>
                  <p className="pl-3 mb-3 text-sm font-medium capitalize">
                    <span className="font-semibold">5.0 ★</span>{" "}
                    <span className="text-slate-700">
                      ({selected.reviews} reviews)
                    </span>
                  </p>
                  <p>{selected.address}</p>
                </div>
              </Popup>
            </Link>
          )}

          {/* User Location Marker */}
          <Marker
            longitude={currentLocation.longitude}
            latitude={currentLocation.latitude}
            anchor="bottom"
          >
          </Marker>

          {/* User Entered Location Marker */}
          {userLocation && (
            <Marker
              longitude={currentLocation.longitude}
              latitude={currentLocation.latitude}
              anchor="bottom"
            >
            </Marker>
          )}
        </Map>
      )}
    </div>
  );
};

export default MapComponent;
