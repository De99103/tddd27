import { Course, Login, Popup } from "../components/common";

function Home() {
    return (
        <>
            <Login />

            <h1>Home page</h1>
            <Course />
            <Popup />
        </>
    );
}

export default Home;
