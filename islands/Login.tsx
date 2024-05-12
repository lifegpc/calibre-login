import { Component } from "preact";
import { useEffect, useState } from "preact/hooks";
import { load_dmodule } from "../server/dmodule.ts";
import BTextField from "../components/BTextField.tsx";
import { MdTonalButton } from "../server/dmodule.ts";

type Props = {
    i18n?: Record<string, string | undefined>;
};

export default class Login extends Component<Props> {
    render() {
        const [username, set_username] = useState<string>();
        const [password, set_password] = useState<string>();
        const [disabled, set_disabled] = useState(false);
        const [dmodule_loaded, set_dmodule_loaded] = useState(false);
        useEffect(() => {
            load_dmodule().then(() => set_dmodule_loaded(true)).catch((e) => {
                console.error(e);
            });
        });
        if (!dmodule_loaded) return null;
        if (!MdTonalButton.value) return null;
        const Button = MdTonalButton.value;
        const login = async (username: string, password: string) => {
            const b = new URLSearchParams();
            b.append("username", username);
            b.append("password", password);
            if (document.location.protocol === "https:") {
                b.append("secure", "1");
            }
            const re = await fetch("/login", { method: "POST", body: b });
            if (!re.ok) {
                throw Error("Login failed");
            }
        };
        return (
            <div>
                <BTextField
                    type="text"
                    label={this.props.i18n?.username || "Username"}
                    value={username}
                    set_value={set_username}
                />
                <BTextField
                    type="password"
                    label={this.props.i18n?.password || "Password"}
                    value={password}
                    set_value={set_password}
                />
                <Button
                    disabled={disabled || !username || !password}
                    onClick={() => {
                        if (!username || !password) return;
                        login(username, password).then(() => {
                            set_disabled(false);
                            const from =
                                new URL(document.location.href).searchParams
                                    .get("from") || "/";
                            document.location.href = from;
                        }).catch((e) => {
                            console.error(e);
                            set_disabled(false);
                        });
                    }}
                >
                    {this.props.i18n?.login || "Log in"}
                </Button>
            </div>
        );
    }
}
