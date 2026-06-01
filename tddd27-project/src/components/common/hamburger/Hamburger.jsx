import "./Hamburger.css";

function Hamburger({ isOpen }) {
    return (
        <>
            <div className="hamburger">
                <div className="burger burger1"></div>
                <div className="burger burger2"></div>
                <div className="burger burger3"></div>
            </div>

            <style>{`

                .burger1 {
              
                    transform: ${isOpen ? "translateY(0.65rem) rotate(-45deg)" : "translateY(0) rotate(0)"};
                }
                .burger2 {
                    //transform: ${isOpen ? "rotate(-45deg)" : "rotate(0)"};
                    opacity: ${isOpen ? 0 : 1};
                }
                .burger3 {
                    transform: ${isOpen ? "translateY(-0.65rem) rotate(45deg)" : "translateY(0) rotate(0)"};
                }

            `}</style>
        </>
    );
}

export default Hamburger;
