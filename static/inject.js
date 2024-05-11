const ob = new MutationObserver((records) => {
    for (const record of records) {
        const box = record.target.querySelector("div.button-box");
        if (
            record.target.children.length == 2 &&
            record.target.innerText?.match("(登录|login)") && box
        ) {
            record.target.classList.add("login-model");
            if (
                box.children.length === 2 &&
                !record.target.classList.contains("injected")
            ) {
                record.target.classList.add("injected");
                console.log("injected");
                const a = document.createElement("a");
                a.classList.add("calibre-push-button");
                a.role = "button";
                const form = document.createElement("form");
                form.style.display = "none";
                form.method = "post";
                form.action = "/logout";
                a.onclick = () => {
                    form.submit();
                };
                a.appendChild(form);
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
