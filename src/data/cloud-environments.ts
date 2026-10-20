import {
  vpsEnvironmentHeader,
  vpsLinuxSystems,
  vpsOneClickApps,
} from "./vps-environments";

// Reuse the approved VPS content, with logos served from Cloud's asset directory.
const cloudLogo = (logo: string) =>
  logo.replace("/images/vps/brands/", "/images/cloud-server/");

export const cloudEnvironmentHeader = vpsEnvironmentHeader;
export const cloudOperatingSystems = vpsLinuxSystems.map((item) => ({
  ...item,
  logo: cloudLogo(item.logo),
}));
export const cloudOneClickApps = vpsOneClickApps.map((item) => ({
  ...item,
  logo: cloudLogo(item.logo),
}));
