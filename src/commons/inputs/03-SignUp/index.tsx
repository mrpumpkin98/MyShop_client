import type { UseFormRegisterReturn } from "react-hook-form";
import * as B from "../styles/03";

interface IInputProps {
  type?: "text" | "password";
  register: UseFormRegisterReturn;
  title: string;
}

export default function Input02(props: IInputProps): JSX.Element {
  return (
    <B.Input03
      placeholder={props.title ?? "입력해 주세요."}
      type={props.type ?? "text"}
      {...props.register}
    />
  );
}
