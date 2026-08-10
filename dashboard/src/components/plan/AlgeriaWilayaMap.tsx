"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { wilayaIdForName } from "@/lib/sample-data";

export type PickedWilaya = {
  key: string;
  name: string;
  id?: number;
};

type Props = {
  selectedKeys: string[];
  onToggle: (wilaya: PickedWilaya) => void;
};

const BASE_STYLE = {
  fillColor: "#f7e7ce",
  color: "#b08d2e",
  weight: 0.6,
  fillOpacity: 0.55,
};

const SELECTED_STYLE = {
  fillColor: "#93e9be",
  color: "#b08d2e",
  weight: 1.4,
  fillOpacity: 0.9,
};

function FitBounds({ data }: { data: unknown }) {
  const map = useMap();
  useEffect(() => {
    if (!data) return;
    const layer = L.geoJSON(data as GeoJSON.GeoJsonObject);
    map.fitBounds(layer.getBounds().pad(0.05));
  }, [data, map]);
  return null;
}

export default function AlgeriaWilayaMap({ selectedKeys, onToggle }: Props) {
  const [data, setData] = useState<GeoJSON.GeoJsonObject | null>(null);
  const layersRef = useRef(new Map<string, L.Path>());

  useEffect(() => {
    let cancelled = false;
    fetch("/data/dz-wilayas.geojson")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setData(json as GeoJSON.GeoJsonObject);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const selected = new Set(selectedKeys);
    layersRef.current.forEach((layer, key) => {
      layer.setStyle(selected.has(key) ? SELECTED_STYLE : BASE_STYLE);
      if (selected.has(key)) layer.bringToFront();
    });
  }, [selectedKeys]);

  return (
    <div className="relative z-0 h-[420px] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={[28, 2.6]}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: "#f5f2e8" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data && (
          <>
            <FitBounds data={data} />
            <GeoJSON
              key="dz-wilayas"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data={data as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onEachFeature={(feature: any, layer: any) => {
                const name = feature?.properties?.name as string | undefined;
                if (!name) return;
                const path = layer as L.Path;
                path.setStyle(BASE_STYLE);
                path.bindTooltip(name, {
                  sticky: true,
                  className: "wilaya-tooltip",
                });
                path.on("click", () => {
                  onToggle({
                    key: name,
                    name,
                    id: wilayaIdForName(name),
                  });
                });
                layersRef.current.set(name, path);
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
