import { Course, Login } from "../components/common";

function Home() {
    return (
        <>
            <Login />

            <h1>Home page</h1>
            <Course />
            <Course />
        </>
    );
}

export default Home;
