import { Course, Login, Popup } from "../components/common";

function Home() {
    return (
        <>
            <Login />

            <h1>Home page</h1>
            <p>Working on  progress <progress value="35" max="100"></progress> </p>
            <Course />
            <Popup />
        </>
    );
}

export default Home;
