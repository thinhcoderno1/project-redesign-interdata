export const technologyPartnerGroups = [
  {
    id: "hardware",
    name: "Phần cứng & linh kiện",
    partners: [
      { name: "AMD", asset: "amd.svg", shape: "wordmark" },
      { name: "Intel", asset: "intel.png", shape: "compact" },
      { name: "Samsung", asset: "samsung.svg", shape: "wordmark" },
      { name: "DELL", asset: "dell.svg", shape: "compact" },
      { name: "Lenovo", asset: "lenovo.svg", shape: "wordmark" },
      { name: "HPE", asset: "hpe.svg", shape: "wide" },
      { name: "Supermicro", asset: "supermicro.svg", shape: "wide" },
    ],
  },
  {
    id: "virtualization",
    name: "Nền tảng ảo hóa",
    partners: [
      { name: "Proxmox", asset: "proxmox.png", shape: "padded" },
      { name: "VMware", asset: "vmware.png", shape: "padded" },
    ],
  },
  {
    id: "container-orchestration-demo",
    name: "Điều phối container — minh họa demo",
    partners: [
      {
        name: "Kubernetes",
        asset: "kubernetes.svg",
        shape: "wide",
        demo: true,
      },
    ],
  },
  {
    id: "platforms",
    name: "Hệ điều hành & nền tảng",
    partners: [
      { name: "Linux", asset: "linux.png", shape: "padded" },
      { name: "Microsoft", asset: "microsoft.svg", shape: "wide" },
    ],
  },
  {
    id: "cloud",
    name: "Trung tâm dữ liệu & Cloud",
    partners: [
      { name: "Viettel IDC", asset: "viettel-idc.png", shape: "wide" },
      { name: "FPT Fornix", asset: "fpt-fornix.svg", shape: "inverse" },
      { name: "VNPT", asset: "vnpt.png", shape: "padded" },
      { name: "GreenCloud", asset: "greencloud.png", shape: "inverse" },
      { name: "AWS", asset: "aws.svg", shape: "wide" },
    ],
  },
  {
    id: "cloud-native-demo",
    name: "Cloud Native & vận hành — minh họa demo",
    partners: [
      {
        name: "Prometheus",
        asset: "prometheus.svg",
        shape: "wide",
        demo: true,
      },
      { name: "Helm", asset: "helm.svg", shape: "wide", demo: true },
      {
        name: "containerd",
        asset: "containerd.svg",
        shape: "wide",
        demo: true,
      },
    ],
  },
] as const;
