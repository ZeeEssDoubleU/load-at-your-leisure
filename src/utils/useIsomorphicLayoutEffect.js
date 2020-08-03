import { useLayoutEffect, useEffect } from "react";

//************
// component
//************

// hack to prevent useLayoutEffect warning with SSR
const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;
export default useIsomorphicLayoutEffect;
