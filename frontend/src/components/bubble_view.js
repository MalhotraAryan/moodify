import { useState, useRef } from "react";

const tagToColor = {
    "Energetic": "#ff8c42",
    "Peaceful": "#2b7a78",
    "Happy": "#ffcc00",
    "Sad": "#4b4e6d",
    "Groovy": "#d72638",
    "Romantic": "#b2226d",
    "Dark": "#1e1e2f",
    "World": "#5d8aa8",
    "Workout": "#ff4500",
    "Misc": "#606060"
};

function BubbleView({ allSongs, userLibrary, setSongs, setDisplayList }) {
    const userLib = userLibrary.song_lib;

    const svgRef = useRef(null);

    const width = 800;
    const height = 600;

    const maxSize = Math.max(...Object.values(userLib).map(songs => songs.length));
    const radiusScale = scaleSqrt([0, maxSize], [10, 100]);

    const [bubbles, setBubbles] = useState(generateBubbles(width, height, userLib, radiusScale));

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const svg = svgRef.current.getBoundingClientRect();
        const startX = e.clientX - svg.left;
        const startY = e.clientY - svg.top;

        const bubbleTag = e.target.getAttribute("id");

        const bubbleElement = e.target.closest("g");
        if (bubbleElement) {
            svgRef.current.appendChild(bubbleElement);
        }

        setBubbles(prevBubbles =>
            prevBubbles.map((bubble) =>
                bubble.tag === bubbleTag
                    ? { ...bubble,
                        isDragging: true,
                        offsetX: startX - bubble.x,
                        offsetY: startY - bubble.y,
                        mouseDownTime: Date.now()
                    }
                    : bubble
            )
        );
    };

    const handleMouseMove = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const svg = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svg.left;
        const mouseY = e.clientY - svg.top;

        setBubbles(prevBubbles =>
            prevBubbles.map(bubble =>
                bubble.isDragging
                    ? {
                          ...bubble,
                          x: Math.max(bubble.radius, Math.min(mouseX - bubble.offsetX, width - bubble.radius)),
                          y: Math.max(bubble.radius, Math.min(mouseY - bubble.offsetY, height - bubble.radius)),
                      }
                    : bubble
            )
        );
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const bubbleTag = e.target.getAttribute("id");
        const bubbleIdx = bubbles.findIndex(b => b.tag === bubbleTag);
        const bubble = bubbles[bubbleIdx];

        if (!bubble) return;

        // click handling
        if (bubbleTag.includes(" + ")) {
            const clickTime = Date.now() - bubble.mouseDownTime;
            const bubbleTags = bubble.tag.split(" + ");
            if (bubbleTags.length > 1 && clickTime < 100) {
                const poppedTag = bubbleTags.pop();
                const leftoverTag = bubbleTags.join(" + ");

                const newBubble = {
                    tag: poppedTag,
                    size: userLib[poppedTag].length,
                    radius: radiusScale(userLib[poppedTag].length),
                    x: Math.random() * (width - 2 * bubble.radius) + bubble.radius,
                    y: Math.random() * (height - 2 * bubble.radius) + bubble.radius,
                    offsetX: 0,
                    offsetY: 0,
                    isDragging: false,
                    mouseDownTime: null
                }

                setBubbles(prevBubbles =>
                    prevBubbles
                        .map(b =>
                            b.tag === bubble.tag
                                ? { ...b,
                                    tag: leftoverTag,
                                    size: b.size - userLib[poppedTag].length,
                                    radius: radiusScale(b.size - userLib[poppedTag].length),
                                    isDragging: false,
                                    mouseDownTime: null
                                  }
                                : b
                        )
                        .concat(newBubble) // Add the new bubble
                );
                return;
            }
        }
       
        const overlapBubbleIdx = isOverlap(bubble, bubbles);
        const overlapBubble = bubbles[overlapBubbleIdx];

        setBubbles(prevBubbles =>
            prevBubbles
                .filter(b => {
                        if (overlapBubble) return b.tag !== overlapBubble.tag;
                        else return true;
                    }
                )
                .map(b => {
                        const newBubble = {...b, isDragging: false, mouseDownTime: null};
                        if (overlapBubble && newBubble.tag === bubble.tag) {
                            newBubble.tag += " + " + overlapBubble.tag;
                            newBubble.size += overlapBubble.size;
                            newBubble.radius = radiusScale(newBubble.size);
                        }
                        return newBubble;
                    }
                )
        );
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const bubbleTag = e.target.getAttribute("id");
        if (!bubbleTag) return;

        const bubbleTags = bubbleTag.split(" + ");

        const flatUserLib = bubbleTags.flatMap(tag => userLibrary.song_lib[tag] || []);
        const userLibSongs = allSongs.filter(song => flatUserLib.includes(song._id));

        setSongs(userLibSongs);
        setDisplayList(true);
    };
   
    return (
        <div class="bubbleview_container">
            <svg
                class="bubble_svg"
                ref={svgRef}
                width={width}
                height={height}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseDown={handleMouseDown}
                onContextMenu={handleRightClick}
                style={{ border: "1px solid white" }}
            >
                {bubbles.map(bubble => (
                    <g key={bubble.tag}>
                        <circle
                        id={bubble.tag}
                        cx={bubble.x}
                        cy={bubble.y}
                        r={bubble.radius}
                        fill={getBubbleColor(bubble.tag.split(" + ").map(tag => tagToColor[tag]))}
                        stroke="black"
                        strokeWidth="2"
                        />
                        <text
                            x={bubble.x}
                            y={bubble.y}
                            fontSize={20}
                            textAnchor="middle"
                            fill="white"
                            pointerEvents="none"
                        >
                            {getTextChunks(bubble.tag.split(" + "), 3)
                                .map((line, index) => (
                                    <tspan
                                        key={index}
                                        x={bubble.x}
                                        dy={index === 0 ? -(bubble.tag.split(" + ").length * 5): "1.2em"}
                                    >
                                        {line.join(" + ")}
                                    </tspan>
                                ))}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
        
    );
}

export default BubbleView;

function getTextChunks(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function getBubbleColor(tags) {
    if (tags.length === 1) return tags[0];

    const hexToRgb = hex => {
        const bigint = parseInt(hex.slice(1), 16);
        return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255
        };
      };
    
    const rgbToHex = ({ r, g, b }) =>
    `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)}`;

    const blendedRgb = tags
    .map(hexToRgb)
    .reduce(
        (acc, rgb) => ({
        r: acc.r + rgb.r,
        g: acc.g + rgb.g,
        b: acc.b + rgb.b
        }),
        { r: 0, g: 0, b: 0 }
    );

    const numColors = tags.length;

    return rgbToHex({
        r: Math.round(blendedRgb.r / numColors),
        g: Math.round(blendedRgb.g / numColors),
        b: Math.round(blendedRgb.b / numColors)
    });
}

function generateBubbles(width, height, userLib, radiusScale) {
    const bubbles = [];
    let attempts = 0;
    const maxAttempts = 10; // Avoid infinite loops

    Object.keys(userLib)
        .filter(tag => userLib[tag].length > 0)
        .forEach(tag => {
            const radius = radiusScale(userLib[tag].length);
            const newBubble = {
                tag: tag,
                size: userLib[tag].length,
                radius: radius,
                x: Math.random() * (width - 2 * radius) + radius,
                y: Math.random() * (height - 2 * radius) + radius,
                offsetX: 0,
                offsetY: 0,
                isDragging: false,
                mouseDownTime: null
            };

            // Incrementally add valid bubbles
            while (!isValidPosition(newBubble, bubbles, width, height) && attempts < maxAttempts) {
                attempts++;
                // Generate a new random position for the bubble if invalid
                newBubble.x = Math.random() * (width - 2 * newBubble.radius) + newBubble.radius;
                newBubble.y = Math.random() * (height - 2 * newBubble.radius) + newBubble.radius;
            }

            bubbles.push(newBubble); // Add to bubbles
        });

    return bubbles;
}

function isValidPosition(bubble, bubbles, width, height) {
    // Check if bubble is within boundaries
    if (
        bubble.x - bubble.radius < 0 ||
        bubble.x + bubble.radius > width ||
        bubble.y - bubble.radius < 0 ||
        bubble.y + bubble.radius > height
    ) {
        return false;
    }

    // Check for overlap with other bubbles
    if (isOverlap(bubble, bubbles)) return false;
    return true;
}

function isOverlap(bubble, bubbles) {
    if (!bubble) {
        console.log("error");
        return undefined;
    }
    for (let i = 0; i < bubbles.length; i++) {
        const existingBubble = bubbles[i];
        if (bubble.tag !== existingBubble.tag) {
            const dx = bubble.x - existingBubble.x;
            const dy = bubble.y - existingBubble.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = bubble.radius + existingBubble.radius;

            if (distance < minDistance) {
                return i; // Return the index of the overlapping bubble
            }
        }
    }
    return undefined; // No overlap found
}

function scaleSqrt(domain, range) {
    const [domainMin, domainMax] = domain;
    const [rangeMin, rangeMax] = range;

    return function(value) {
        const normalized = (value - domainMin) / (domainMax - domainMin);
        const sqrtValue = Math.sqrt(normalized);
        return rangeMin + (rangeMax - rangeMin) * sqrtValue;
    };
}

