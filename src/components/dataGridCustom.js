import { Fragment, useMemo, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Button, Stack } from '@mui/material'
import { FaArrowDownLong } from 'react-icons/fa6'
import ReactCSV from './common/ReactCSV'

const DataGridCustom = ({ columns, rows, nameItem }) => {
    const [search, setSearch] = useState('')
    const [pageSize, setPageSize] = useState(15)
    const [page, setPage] = useState(0)

    const headers = useMemo(() => columns.map((item) => ({ label: item.headerName, key: item.field })), [columns])

    const _columns = useMemo(() => {
        let temp = [...columns]
        return temp
    }, [columns])

    const _rows = useMemo(() => {
        let temp = [...rows]
        return temp
    }, [rows])

    const filteredRows = useMemo(() => {
        if (!search) {
            return _rows
        }

        const lowerSearch = search.toLowerCase()
        return _rows.filter((row) =>
            columns.some((column) => {
                const cellValue = `${row[column.field]}`.toLowerCase()
                return cellValue.includes(lowerSearch)
            })
        )
    }, [_rows, search, columns])

    return (
        <Fragment>
            <div className='flex gap-5 items-center justify-between flex-wrap pb-3'>
                <div>
                    <ReactCSV filename={`Danh sách ${nameItem}`} headers={headers} data={filteredRows || []}>
                        <Button color='secondary' variant='outlined' className='flex flex-nowrap items-center gap-x-1'>
                            <FaArrowDownLong />
                            Xuất File
                        </Button>
                    </ReactCSV>
                </div>
                <div className='w-[250px]'>
                    <input
                        type='text'
                        placeholder='Tìm kiếm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='p-2 border border-solid rounded w-full'
                    />
                </div>
            </div>
            <DataGrid
                sx={{
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer'
                    }
                }}
                components={{
                    NoRowsOverlay: () => (
                        <Stack sx={{ marginTop: '40px' }} height='100%' alignItems='center' justifyContent='start'>
                            Không có bản ghi nào
                        </Stack>
                    ),
                    Toolbar: GridToolbar
                }}
                rows={filteredRows}
                columns={_columns}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                showCellVerticalBorder
                showColumnVerticalBorder
                autoHeight
                page={page}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                rowsPerPageOptions={[5, 15, 30, 50]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true
                    }
                }}
            />
        </Fragment>
    )
}

export default DataGridCustom
