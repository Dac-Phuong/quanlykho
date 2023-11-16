import React from 'react'
import { CSVLink, CSVDownload } from 'react-csv'

function ReactCSV({ children, headers, data, filename }) {
    return (
        <>
            <CSVLink filename={filename} headers={headers} data={data}>
                {children}
            </CSVLink>
        </>
    )
}

export default ReactCSV
