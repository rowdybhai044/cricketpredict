export function saveAuth(data: any) {
    const user = data?.user;
    localStorage.setItem("token", data?.tokens?.access);
    localStorage.setItem("role", user?.role);
    localStorage.setItem("userId", String(user?.id));
    localStorage.setItem("name", user?.name);
    localStorage.setItem("dob", user?.date_of_birth);
    localStorage.setItem("wallet", user?.wallet_balance);
    localStorage.setItem("date_joined", user?.date_joined);
}