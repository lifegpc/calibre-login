const ob = new MutationObserver((records) => {
    for (const record of records) {
        const box = record.target.querySelector("div.button-box");
        if (
            record.target.children.length == 2 &&
            record.target.innerText.match("(登录|login)") && box
        ) {
            record.target.classList.add("login-model");
            if (
                box.children.length === 2 &&
                !record.target.classList.contains("injected")
            ) {
                record.target.classList.add("injected");
                console.log("injected");
                const a = document.createElement("a");
                a.href = "/logout";
                a.classList.add("calibre-push-button");
                a.role = "button";
                const span = document.createElement("span");
                span.innerText = logout_text;
                a.appendChild(span);
                box.innerHTML += "&nbsp;";
                box.appendChild(a);
            }
        }
    }
});
ob.observe(document, { childList: true, subtree: true });
