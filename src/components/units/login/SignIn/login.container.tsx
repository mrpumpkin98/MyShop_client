import { ChangeEvent, useState, useRef, useEffect } from "react";
import { FETCH_USER_LOGGED_IN, LOGIN_USER } from "./login.queries";
import LoginUI from "./login.presenter";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../../commons/stores";
import { useMutation, useQuery } from "@apollo/client";
import type {
  IMutation,
  IMutationLoginUserArgs,
} from "../../../src/commons/types/generated/types";

export const schema = yup.object({
  // email: yup
  //   .string()
  //   .email("이메일 형식에 적합하지 않습니다.")
  //   .required("이메일은 필수 입력입니다."),
  // password: yup
  //   .string()
  //   .min(4, "비밀번호는 최소 4자리 이상 입력해 주세요.")
  //   .max(15, "비밀번호는 최대 15자리로 입력해 주세요.")
  //   .required("비밀번호는 필수 입력입니다."),
  // email: yup
  //   .string()
  //   .email("이메일 형식에 적합하지 않습니다.")
  //   .required("이메일은 필수 입력입니다."),
  // password: yup
  //   .string()
  //   .min(4, "비밀번호는 최소 4자리 이상 입력해 주세요.")
  //   .max(15, "비밀번호는 최대 15자리로 입력해 주세요.")
  //   .required("비밀번호는 필수 입력입니다."),
  // phone: yup
  //   .string()
  //   .matches(/^\d{3}-\d{3,4}-\d{4}$/, "휴대폰 형식에 알맞지 않습니다.")
  //   .required("휴대폰은 필수 입력입니다."),
});

export default function LoginNewPage(props): JSX.Element {
  const router = useRouter();
  const [, setAccessToken] = useRecoilState(accessTokenState);

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [loginUser] = useMutation(LOGIN_USER);

  const onClickLogo = (): void => {
    void router.push("/Board");
  };

  const onClickLogin = async (data: any): Promise<void> => {
    try {
      // 1. 로그인 뮤테이션 날려서 accessToken 받아오기
      const result = await loginUser({
        variables: { email: data.email, password: data.password },
      });
      const accessToken = result.data?.loginUser.accessToken;
      console.log(accessToken);

      // 2. 받아온 accessToken을 globalState에 저장하기
      if (accessToken === undefined) {
        alert("로그인에 실패했습니다! 다시 시도해 주세요!");
        return;
      }
      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken); // 임시 사용(나중에 지울 예정)
      alert("로그인에 성공했습니다!");
      // 3. 로그인 성공 페이지로 이동하기
      void router.push("/Market");
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };
  return (
    <div>
      <LoginUI
        onClickLogo={onClickLogo}
        onClickLogin={onClickLogin}
        register={register}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}