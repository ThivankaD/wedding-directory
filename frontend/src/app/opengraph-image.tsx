import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Say I Do — Sri Lanka Wedding Directory & Planning Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF9F5",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "960px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 24px",
              borderRadius: "9999px",
              backgroundColor: "#FCEEE6",
              border: "1px solid #F6D5C5",
              color: "#EB6E4B",
              fontSize: "18px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "28px",
            }}
          >
            <span>Sri Lanka's Premier Wedding Platform</span>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: "72px",
              fontWeight: 800,
              color: "#1E1E1E",
              lineHeight: 1.1,
              marginBottom: "20px",
              letterSpacing: "-1.5px",
            }}
          >
            <span>Say I Do</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              color: "#5B5550",
              lineHeight: 1.4,
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            <span>
              Your complete destination for discovering top wedding venues, photographers, bridal styling, decor and planning tools.
            </span>
          </div>

          {/* Feature highlights */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            {["Verified Vendors", "Interactive Budgeter", "Guest List Manager", "Expert Wedding Guides"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 20px",
                    borderRadius: "14px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EAE3DC",
                    color: "#2C2723",
                    fontSize: "17px",
                    fontWeight: 600,
                  }}
                >
                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer brand label */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            display: "flex",
            alignItems: "center",
            fontSize: "17px",
            color: "#8B847D",
            fontWeight: 500,
          }}
        >
          <span>sayido.lk • Sri Lanka</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
