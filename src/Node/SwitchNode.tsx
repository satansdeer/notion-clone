import { ReactElement } from "react";

type SwitchNodeProps = {
  type: string;
  children: ReactElement<{ supportedTypes: string[] }>[];
};

export const SwitchNode = ({ type, children }: SwitchNodeProps) => {
  return children.find((child) => {
    return child.props.supportedTypes.includes(type);
  }) || null;
};
