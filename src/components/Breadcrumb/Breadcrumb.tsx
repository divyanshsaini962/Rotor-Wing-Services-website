"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome } from "react-icons/fi";
import styles from "./Breadcrumb.module.css";
import { aircrafts, airports, blogs, internationalLocations, usCanadaLocations } from "../Locations";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const pathSegments: string[] = pathname?.split("/").filter(Boolean) || [];

  // console.log("pathname", pathname);
  // console.log("pathSegments", pathSegments);

  // Rewrite mappings (including dynamic routes)
  const rewriteMapping: { [key: string]: string; } = {
    '/our-services/on-demand-charter': '/',
    
  };

  // Helper function to apply rewrite rules based on dynamic segments
  const applyRewrite = (path: string, reverse: boolean = false): string => {
    for (const [dest, source] of Object.entries(rewriteMapping)) {
      const from = reverse ? dest : source;
      const to = reverse ? source : dest;

      const regex = new RegExp(
        "^" + from.replace(/:([^/]+)/g, "([^/]+)") + "$"
      );
      const match = path.match(regex);

      if (match) {
        let rewrittenPath = to;
        const dynamicParts = from.match(/:([^/]+)/g) || [];
        dynamicParts.forEach((part, index) => {
          const value = match[index + 1];
          rewrittenPath = rewrittenPath.replace(part, value);
        });
        return rewrittenPath;
      }
    }
    return path; // Return original path if no rewrite match is found
  };

  const getRewritePath = (segments: string[]) =>
    applyRewrite("/" + segments.join("/"));
  const getRewrittenHref = (actualPath: string) =>
    applyRewrite(actualPath, true);
  let href;
  // console.log(pathSegments.slice(0, 1)[0])
  if (pathSegments.slice(0, 1)[0] !== "cost-of-chartering-a-private-jet" && pathSegments.slice(0, 1)[0] !== "request-a-quote" && pathSegments.slice(0, 1)[0] !== "faq" && pathSegments.slice(0, 1)[0] !== "instant-private-jet-quotes" && pathSegments.slice(0, 1)[0] !== "industry-specific-charter" && pathSegments.slice(0, 1)[0] !== "events") {
    href = getRewritePath(pathSegments.slice(0, 1));
    // console.log("if")
  }
  else {
    href = getRewritePath(pathSegments);
  }

  // console.log("href", href);
  const segments = href.split("/").filter(Boolean); // Remove empty segments
  // Determine the base segment dynamically (e.g., 'jet-charter' or 'charter-resources')
  // console.log("segments", segments);
  let subOption = segments[1]; // cities, empty-legs etc.    


  if (blogs.includes(segments[segments.length - 1])) {// This condition will only be true for those blog pages whose url starts with 'empty-leg-flights-' for eg. '/empty-leg-flights-a-guide-to-luxury-travel-at-a-fraction-of-the-cost'
    segments[0] = 'company';
    if (segments[1] == 'empty-legs') {
      segments[segments.length - 1] = 'empty-leg-flights-' + segments[segments.length - 1];
    }
    segments[1] = 'blog';
  }
  else if (subOption == "cities") {
    if (usCanadaLocations.includes(segments[segments.length - 1])) {
      subOption = 'us-canada';
    } else if (internationalLocations.includes(segments[segments.length - 1])) {
      subOption = 'international';
    }
    segments[1] = subOption;

  }
  else if (subOption == "airports-aircrafts") {
    if (aircrafts.includes(segments[segments.length - 1])) {
      subOption = 'aircraft-types';
    } else if (airports.includes(segments[segments.length - 1])) {
      subOption = 'private-jet-airports';
    } else if (blogs.includes(segments[segments.length - 1])) {
      subOption = 'blog';
      segments[0] = 'company';
    }
    segments[1] = subOption;
  }
  const baseSegment = segments[0]; // Get the first segment
  // console.log("baseSegment", baseSegment);
  let hrefArray = segments;
  if (hrefArray.length != 1 && hrefArray[0] != "industory-charter" && hrefArray[0] != "events") {
    hrefArray = segments.slice(1);
  }

  // console.log("href", href);
  // console.log("hrefArray", hrefArray);

  return (
    (<div
      className={`${styles.breadcrumbContainer} flex items-center w-fit gap-1 flex-wrap`}
    >
      <div className="rounded-lg">
        <Link
          href="/"
          className={`${styles.breadcrumbLink} rounded-l-md px-3 py-2 flex items-center h-10 text-xl gap-1 text-white z-10`}
        >
          <FiHome />
        </Link>
      </div>
      {
        hrefArray.map((segment, index) => {
          let hrefPath;
          if (baseSegment == "events" || baseSegment == "industory-charter" || baseSegment == "pricing" || baseSegment == "request-quote" || baseSegment == "instant-qoute" || baseSegment == "faq") {
            hrefPath = "/";
          } else {
            hrefPath = `/${[
              baseSegment,
              ...hrefArray.slice(0, index + 1),
            ].join("/")}`;
          }

          // console.log(`hrefPath: ${hrefPath}`)

          const rewrittenHref = getRewrittenHref(hrefPath);
          const segmentName = segment.replace(/-/g, " ").toUpperCase();
          const zIndex = 8 - index;
          // console.log(`rewrittenHref: ${rewrittenHref}`)
          // console.log(`segmentName: ${segmentName}`)


          return (
            <div key={`${hrefPath}-${index}`} className="flex items-center">
              <Link
                href={"/"}
                className={`${styles.breadcrumbLink} whitespace-nowrap py-2 pl-7 pr-3`}
                style={{ zIndex: zIndex }}
              >
                {segmentName == "INSTANT QOUTE" ? "INTANT QUOTE" : segmentName}
              </Link>
            </div>
          );
        })}
    </div>)
  );
};

export default Breadcrumb;
