import {
    Course,
    Login,
    OtherProfile,
    Stats_Window,
} from "../components/common";

function Account() {
    return (
        <div>
            <Login />
            <h1>Account Page</h1>
            <OtherProfile />
        </div>
    );
}

export default Account;
