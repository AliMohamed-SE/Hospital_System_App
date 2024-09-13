"use client";

const SignOutButton = () => {
  const handleSignOut = async () => {
    const response = await fetch("/api/auth/signout", { method: "GET" });

    if (response.ok) {
      window.location.href = "/";
    }
  };

  return (
    <button type="button" className="outline_btn" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
