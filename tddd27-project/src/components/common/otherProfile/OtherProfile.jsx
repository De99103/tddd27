import "./OtherProfile.css";

function OtherProfile() {
    return (
        <div className="other_profile_page">
            <div className="search_profile_container">
                <p>Search for </p>
                <input className="profile_search"></input>
                <p>'s profile</p>
            </div>

            <div className="other_profile_overlay">
                <p>You are looking at </p>
                <h3>placeholder</h3>
                <p>'s profile</p>
            </div>
        </div>
    );
}

export default OtherProfile;
