import React, { useMemo, useState } from 'react'

const URL_SPLIT = /(https?:\/\/[^\s]+)/g

function renderWithLinks(text) {
    if (!text) {
        return null;
    }
    const parts = text.split(URL_SPLIT);
    return parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
            try {
                const u = new URL(part);
                if (u.protocol !== 'http:' && u.protocol !== 'https:') {
                    return <span key={i}>{part}</span>;
                }
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3ea6ff] hover:underline break-all"
                    >
                        {part}
                    </a>
                );
            } catch {
                return <span key={i}>{part}</span>;
            }
        }
        return <span key={i}>{part}</span>;
    });
}

const Description = ({text}) => {

    const [expanded, setExpanded] = useState(false);

    const showButton = useMemo(() => {
        if (!text?.trim()) {
            return false;
        }
        const lineCount = text.split('\n').length;
        return text.length > 220 || lineCount > 3;
    }, [text]);

    return (
        <div className='text-sm text-gray-300'>
            <div
                className={`whitespace-pre-line wrap-break-word leading-relaxed ${
                    expanded ? '' : 'line-clamp-3'
                }`}
            >
                {renderWithLinks(text)}
            </div>
            {showButton && (
                <button
                    type='button'
                    className='mt-1.5 text-[13px] font-semibold text-gray-200 hover:text-white cursor-pointer'
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
};

export default Description;
