import { useEffect } from "react";
import { useLocation } from "wouter";
import AuthSuccessMessage from "../components/common/AuthSuccessMessage";
import { useAuth } from "../contexts/AuthContext";
import { BASE_PATH } from "../lib/utils";

interface RedirectPageProps {
    title: string;
    message: string;
    redirectMessage: string;
    redirectTo: string;
    role?: string;
    delay?: number;
}

export default function RedirectPage({
    title,
    message,
    redirectMessage,
    redirectTo,
    role = "patient",
    delay = 2000
}: RedirectPageProps) {
    const [, setLocation] = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            // If redirecting to root and we have user data, go directly to the user's dashboard
            if (redirectTo === "/" && user) {
                setLocation(`/${user.role}`);
            } else if (redirectTo === "/" && !user) {
                // If redirecting to root but no user data, go to home page
                // The wouter Router component with base path will handle the base path automatically
                setLocation("/");
            } else {
                // For other redirects, go to the specified location
                // The wouter Router component with base path should handle this correctly
                setLocation(redirectTo);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [setLocation, redirectTo, delay, user]);

    return (
        <AuthSuccessMessage
            title={title}
            message={message}
            redirectMessage={redirectMessage}
            role={role}
        />
    );
}