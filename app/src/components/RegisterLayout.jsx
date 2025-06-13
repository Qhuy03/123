// components
import Logo from "@components/Logo";
import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";
import { toast } from "react-toastify";
import Spring from "@components/Spring";

// hooks
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";

// utils
import classNames from "classnames";

// assets
import media from "@assets/login.webp";
import google from "@assets/icons/google.png";
import facebook from "@assets/icons/facebook.png";
import { AuthInstance } from "../api/config";

const AuthLayout = () => {
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await AuthInstance.post("/users/register", data);
      // const data = res.data;
      navigate("/success");
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  const onReject = (err) => {
    toast.error(err);
  };

  return (
    <div className="flex-1 grid grid-cols-1 4xl:grid-cols-[minmax(0,_1030px)_minmax(0,_1fr)] lg:grid-cols-2">
      {width >= 1024 && (
        <div className="flex flex-col justify-center items-center lg:p-[60px]">
          <Logo imgClass="w-[60px]" textClass="text-[28px]" />
          <p className="text-center text-lg font-semibold leading-6 max-w-[540px] mx-auto my-7 tracking-[0.2px]">
            Buy and sell quickly, easily, and securely on our ecommerce
            platform.
          </p>
          <img className="max-w-[780px]" src={media} alt="media" />
        </div>
      )}
      <div className="flex bg-widget justify-center w-full items-center lg:p-[60px] px-4 py-10">
        <Spring
          className="w-full max-w-[460px]"
          type="slideUp"
          duration={400}
          delay={300}
        >
          <div className="flex flex-col text-center gap-2.5">
            <h1>Join us and start shopping!</h1>
            <p className="m-auto 4xl:max-w-[unset] lg:max-w-[300px]">
              Sign up now to manage your orders and make smarter transactions.
            </p>
          </div>
          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="field-wrapper">
                <label htmlFor="email" className="field-label">
                  E-mail
                </label>
                <input
                  className={classNames("field-input", {
                    "field-input--error": errors.user_email,
                  })}
                  id="user_email"
                  type="text"
                  placeholder="Your E-mail address"
                  {...register("user_email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 items-center mb-10 mt-4">
              <button className="btn btn--primary w-full">Sign up</button>
            </div>
          </form>
          <div>
            <div className="relative">
              <span className="bg-border h-[1px] w-full -translate-y-1/2 absolute left-0 top-1/2" />
              <span className="flex bg-widget h-[23px] justify-center m-auto w-11 items-center relative z-10">
                or
              </span>
            </div>
            <div className="grid grid-cols-1 2xs:grid-cols-2 gap-4 mb-9 mt-[30px] xs:gap-[30px]">
              <LoginSocialGoogle
                className="btn btn--social"
                client_id={import.meta.env.VITE_GOOGLE_APP_ID}
                onReject={onReject}
                onResolve={onSubmit}
              >
                <img className="icon" src={google} alt="Google" />
                Google
              </LoginSocialGoogle>
              <LoginSocialFacebook
                className="btn btn--social"
                appId={import.meta.env.VITE_FB_APP_ID}
                onReject={onReject}
                onResolve={onSubmit}
              >
                <img className="icon" src={facebook} alt="Facebook" />
                Facebook
              </LoginSocialFacebook>
            </div>
            <div className="flex justify-center gap-2.5 leading-none">
              <p>Have an account?</p>
              <button className="text-btn" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
          </div>
        </Spring>
      </div>
    </div>
  );
};

export default AuthLayout;
