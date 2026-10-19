import Image, { type ImageProps } from "next/image";
import dimensions from "./image-dimensions.json";

export default function SourceImage(props: ImageProps) {
  const size = dimensions[String(props.src) as keyof typeof dimensions];
  return <Image {...size} {...props} alt={props.alt} unoptimized />;
}
