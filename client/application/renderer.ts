import React from "react";

/**
 * Monitor method rendering and updates.
 * Use as a hook in a method you want to monitor.
 * Use only for debugging!
 */
const useRerender = () => {
  const owner = (React as any)
    .__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner
    .current;
  const name = owner.type.name ? `<${owner.type.name} />` : "";
  const props = owner.pendingProps;

  React.useEffect(() => {
    console.log(`Component ${name} mounted`);
    return () => {
      console.log(`Component ${name} unmounted`);
    };
  }, [name]);

  console.log(
    `Component ${name} rerender with props: ${JSON.stringify(props)} `
  );
};

export default useRerender;
