import { Login } from "../components/common";
import "./About.css";

function About() {
    return (
        <div className="about-page">
            <Login />

            <main className="about-content">
                <h1>About LiU-Courses</h1>
                <p className="about-intro">
                    A tool built by LiU students to make course planning easier.
                </p>

                <section className="about-section">
                    <h2>How to use</h2>
                    <ol>
                        <li>Sign in with your Google account.</li>
                        <li>Go to the <strong>Home</strong> page and select your program.</li>
                        <li>Choose your specialisation or master profile.</li>
                        <li>Save your courses — mandatory courses are saved automatically.</li>
                        <li>Add grades from the <strong>Account</strong> page, the <strong>Home</strong> page, or directly in the course popup.</li>
                        <li>Make your profile public to share it with others.</li>
                        <li>Share edit access with a friend by entering their email on the Account page.</li>
                    </ol>
                </section>

                <section className="about-section">
                    <h2>About the project</h2>
                    <p>
                        LiU-Courses was built as part of TDDD27 — Advanced Web Programming
                        at Linköping University. It supports the following programs:
                        MT, DT, ED, and IT.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Data & Privacy</h2>
                    <p>
                        Your data is private by default. We store your Google display name,
                        email, saved courses, grades, and sharing settings in Firebase Firestore.
                        You can delete your account and all data at any time from the Account page.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Meet the team</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <h3>Deema Abo Gheda</h3>
                            <a href="mailto:deema.abogheda@gmail.com">deema.abogheda@gmail.com</a>
                        </div>
                        <div className="team-member">
                            <h3>Emma Davidsson</h3>
                        </div>
                    </div>
                </section>

                <footer className="about-footer">
                    LiU-Courses · TDDD27 · 2026
                </footer>
            </main>
        </div>
    );
}

export default About;