import { useEffect, useRef, useState } from 'react';
import { useMounted } from '@ithreat/use-mounted';

export const useMongoWatcher = ({ collection, filter, callback }) => {
    const [ config, setConfig ] = useState({collection, filter, callback});
    const stream = useRef();
    const attempt = useRef(0);
    const isMounted = useMounted();

    useEffect(() => {
        const { collection, filter, callback } = config;

        // filter must be non-empty
        if (!filter || (Array.isArray(filter) && !filter.length) || !Object.entries(filter).length) return;

        // local copy of the stream, for the unmount
        let thisStream;
        const iter = ++attempt.current;

        // console.log(`connecting`, { iter, filter });
        collection.watch(filter).then((str) => {
            if (isMounted() && iter === attempt.current) {
                // console.log(`watching`, { iter, filter });
                stream.current = thisStream = str;
                stream.current.onNext(callback);
            }
            else {
                // console.log(`unmounted while connecting`);
                str.close();
            }
        });

        return () => {
            if (thisStream) {
                // console.log(`unwatching`, { iter, filter })
                thisStream.close();
            }
        }
    }, [config]);

    return {
        ...config,
        setCollection: (collection) => setConfig((config) => ({...config, collection})),
        // only update the filter if it actually LOOKS different
        setFilter: (filter) => setConfig((config) => JSON.stringify(filter) === JSON.stringify(config.filter) ? config : {...config, filter}),
        setCallback: (callback) => setConfig((config) => ({...config, callback})),
    };
};

export default useMongoWatcher;