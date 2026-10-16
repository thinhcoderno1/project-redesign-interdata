import content from "./vps-content.json";

const linuxNames = new Set([
  "Ubuntu",
  "CentOS",
  "Debian",
  "AlmaLinux",
  "Fedora",
]);

// The legacy list includes Webuzo, a control panel, which is not supplied.
// Keep the source snapshot intact; expose only the supported Linux entries.
export const vpsLinuxSystems = content.landing.operatingSystems
  .filter((item) => linuxNames.has(item.name))
  .map((item) =>
    item.name === "Ubuntu"
      ? {
          ...item,
          logo: "/images/vps/brands/operating-systems/ubuntu-icon.webp",
        }
      : item,
  );
export const vpsOneClickApps = content.landing.apps.map((item) =>
  item.name === "OpenClaw"
    ? { ...item, logo: "/images/vps/brands/one-click/openclaw-icon.png" }
    : item,
);
export const vpsEnvironmentHeader = content.landing.headers.OneClickApps;
