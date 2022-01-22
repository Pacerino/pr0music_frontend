import React, { useEffect } from "react";
import { useRouter } from "next/router";

const InfoPage = () => {
    const router = useRouter();
    const { acrid } = router.query;
    if(acrid) {
        window.location.href = `https://aha-music.com/${acrid}`
    }

    return (
        <div>
            <h1>¯\_(ツ)_/¯</h1>
        </div>
    );
};

export default InfoPage;
