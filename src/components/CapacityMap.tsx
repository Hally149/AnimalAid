import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ORIGIN, STATUS_META, type Species } from "@/lib/rehab";
import type { Center } from "@/lib/rehab-data";

function pin(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};box-shadow:0 0 0 4px rgba(255,255,255,.9),0 2px 6px rgba(0,0,0,.25)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

const OPEN_PIN = pin("oklch(0.53 0.11 150)");
const APPT_PIN = pin("oklch(0.63 0.12 75)");

export default function CapacityMap({
  centers,
  species,
}: {
  centers: Center[];
  species: Species;
}) {
  return (
    <MapContainer
      center={[ORIGIN.lat, ORIGIN.lng]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {centers.map((c) => {
        const status = c.statuses[species]?.status ?? "full";
        return (
          <Marker
            key={c.id}
            position={[c.latitude, c.longitude]}
            icon={status === "open" ? OPEN_PIN : APPT_PIN}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {STATUS_META[status].label} · {c.distance.toFixed(1)} mi
              <br />
              <a href={`tel:${c.phone.replace(/[^\d]/g, "")}`}>{c.phone}</a>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
