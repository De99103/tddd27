import "./Hamburger.css";

function Hamburger({ isOpen }) {
    return (
        <>
            <div className="hamburger">
                <div className="burger burger1"></div>
                <div className="burger burger2"></div>
                <div className="burger burger3"></div>
            </div>

            {/* Vill få detta att funkar med separat CSS-fil
Fattar inte hur man importerar variabeln "isOpen" till CSS-filen */}

            <style>{`
                .burger1 {
                    transform: ${isOpen ? "rotate(45deg)" : "rotate(0)"};
                }
                .burger2 {
                    transform: ${isOpen ? "translateX(100%)" : "translateX(0)"};
                    opacity: ${isOpen ? 0 : 1};
                }
                .burger3 {
                    transform: ${isOpen ? "rotate(-45deg)" : "rotate(0)"};
                }
            `}</style>
        </>
    );
}

export default Hamburger;
