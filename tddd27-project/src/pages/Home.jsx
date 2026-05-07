import { Course, Login, Popup } from "../components/common";

function Home() {
    return (
        <>
            <Login />

            <h1>Home page</h1>
            <p>
                Work in progress <progress value="45" max="100"></progress>{" "}
            </p>
            <Popup />
        </>
    );
}

export default Home;
