import { Course, Login, Stats_Window } from "../components/common";

function About() {
    return (
        <div>
            <Login />
            <h1>Welcome to the About Page</h1>
            <p>This is the main landing page of our application.</p>
            <Stats_Window />
        </div>
    );
}

export default About;
