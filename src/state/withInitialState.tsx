import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useMatch } from "react-router-dom";
import { Page } from "./usePageState";

type InjectedProps = {
  initialState: Page;
};

type PropsWithoutInjected<TBaseProps> = Omit<TBaseProps, keyof InjectedProps>;

export function withInitialState<TProps>(
  WrappedComponent: React.ComponentType<
    PropsWithoutInjected<TProps> & InjectedProps
  >
) {
  return (props: PropsWithoutInjected<TProps>) => {
    const match = useMatch("/:slug");
    const pageSlug = match ? match.params.slug : "start";
    const [initialState, setInitialState] = useState<Page>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
			console.log("withInitialState", pageSlug);
      setIsLoading(true);
      const fetchInitialState = async () => {
        try {
          const { data } = await supabase
            .from("pages")
            .select(`title, id, cover, nodes`)
            .eq("slug", pageSlug)
            .single();
          setInitialState(data);
        } catch (e) {
          if (e instanceof Error) {
            setError(e);
          }
        }
        setIsLoading(false);
      };
      fetchInitialState();
    }, [pageSlug]);

    if (isLoading) {
      return <div>Loading</div>;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    if (!initialState) {
      return <div>Page not found</div>;
    }

    return <WrappedComponent {...props} initialState={initialState} />;
  };
}
