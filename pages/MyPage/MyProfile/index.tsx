import MyProfile from "../../../src/components/units/mypage/MyProfile.index";
import { useAuth } from "../../../src/commons/hooks/customs/useAuth";

export default function GraphqlMutationPage() {
  useAuth();
  return (
    <div>
      <MyProfile />
    </div>
  );
}
