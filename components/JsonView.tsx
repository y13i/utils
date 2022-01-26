import dynamic from "next/dynamic";
import { ComponentProps } from "react";

const _ = dynamic(import("react-json-view"), {
  ssr: false,
});

export const JsonView = (props: ComponentProps<typeof _>) => (
  <_ name={false} quotesOnKeys={false} {...props} />
);
