import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../../commons/stores";
import { useMutation } from "@apollo/client";
import * as B from "./signIn.styles";
import Input01 from "../../../../commons/inputs/01-SignIn-top";
import Input02 from "../../../../commons/inputs/02-SignIn-under";
import Button01 from "../../../../commons/buttons/01-SignIn";
import { wrapFormAsync } from "../../../../commons/libraries/asyncFunc";
import { LOGIN_USER } from "../../../../commons/hooks/mutations/UseMutationLoginUser";

export const schema = yup.object({});

export default function LoginNewPage(): JSX.Element {
  const router = useRouter();
  const [, setAccessToken] = useRecoilState(accessTokenState);
  const [loginUser] = useMutation(LOGIN_USER);
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

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
    <>
      <B.Wrapper>
        <B.Logo src="/images/icons/로고.png" onClick={onClickLogo} />
        <B.Form onSubmit={wrapFormAsync(handleSubmit(onClickLogin))}>
          <B.LoginWrapper>
            <B.LoginBox>
              <Input01
                title="이메일을 입력해주세요."
                register={register("email")}
              ></Input01>
              <Input02
                title="비밀번호를 입력해 주세요."
                type="password"
                register={register("password")}
              ></Input02>
            </B.LoginBox>
            <Button01 title="로그인" />
          </B.LoginWrapper>
        </B.Form>
      </B.Wrapper>
    </>
  );
}
