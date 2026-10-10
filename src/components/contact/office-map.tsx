"use client";

import { useState, useSyncExternalStore } from "react";
import { MapPin, Navigation } from "lucide-react";
import { contactDetails, contactOffices } from "@/data/contact";
import styles from "./contact.module.css";

const subscribe = () => () => {};

export function OfficeMap() {
  const enhanced = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [selected, setSelected] = useState<string>(contactOffices[0].id);
  const office =
    contactOffices.find((item) => item.id === selected) ?? contactOffices[0];
  return (
    <div className={styles.officeLayout}>
      <div className={styles.officeDetails}>
        <div
          className={styles.officeSelector}
          role="group"
          aria-label="Chọn văn phòng trên bản đồ"
        >
          {contactOffices.map((item) => (
            <button
              type="button"
              disabled={!enhanced}
              key={item.id}
              onClick={() => setSelected(item.id)}
              aria-pressed={selected === item.id}
              aria-controls="office-map"
              className={styles.officeButton}
            >
              <MapPin size={21} aria-hidden="true" />
              <span>
                <strong>{item.name}</strong>
                <small>{item.shortName}</small>
              </span>
            </button>
          ))}
        </div>
        <div className={styles.officeAddress} aria-live="polite">
          <h3>{office.name}</h3>
          <address>{office.address}</address>
          <p>{contactDetails.hours}</p>
          <a
            href={office.mapUrl}
            className={styles.directionLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation size={18} aria-hidden="true" /> Chỉ đường trên Google
            Maps
          </a>
        </div>
        <noscript>
          <div className={styles.staticOffices}>
            {contactOffices.slice(1).map((item) => (
              <p key={item.id}>
                <strong>{item.name}</strong>
                <br />
                {item.address}
                <br />
                <a href={item.mapUrl}>Chỉ đường trên Google Maps</a>
              </p>
            ))}
          </div>
        </noscript>
      </div>
      <div id="office-map" className={styles.mapFrame}>
        <iframe
          key={office.id}
          title={`Google Maps — InterData ${office.name.toLowerCase()}`}
          src={office.embedUrl}
          width="900"
          height="520"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <a
          className={styles.mapFallback}
          href={office.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Mở bản đồ trong Google Maps ↗
        </a>
      </div>
    </div>
  );
}
