import React, { useEffect, useContext, useState, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/keywordsComponent/keywordsComponent.less';
import { Typography, Snackbar, Alert } from "@mui/material";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";


const ProductAnalyticsColumnFlipkart = [
    {
        field: "product_name",
        headerName: "PRODUCT",
        minWidth: 200,
        renderCell: (params) => params.row.product_name,
    },
    {
        field: "fsn_id",
        headerName: "FSN ID",
        minWidth: 150,
    },
    {
        field: "ad_spend_current",
        headerName: "AD SPEND",
        minWidth: 180,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.ad_spend_current}
                percentValue={params.row.ad_spend_change}
            />
        ),
    },
    {
        field: "views_current",
        headerName: "VIEWS",
        minWidth: 180,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.views_current}
                percentValue={params.row.views_change}
            />
        ),
    },
    {
        field: "direct_units_sold_current",
        headerName: "UNITS SOLD",
        minWidth: 180,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.direct_units_sold_current}
                percentValue={params.row.direct_units_sold_change}
            />
        ),
    },
    {
        field: "direct_revenue_current",
        headerName: "REVENUE",
        minWidth: 180,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.direct_revenue_current}
                percentValue={params.row.direct_revenue_change}
            />
        ),
    },
    {
        field: "roas_current",
        headerName: "ROAS",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.roas_current}
                percentValue={params.row.roas_change}
            />
        ),
    },
    {
        field: "cvr_current",
        headerName: "CVR",
        minWidth: 120,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.cvr_current}
                percentValue={params.row.cvr_change}
            />
        ),
    },
    {
        field: "osa_pct_current",
        headerName: "OSA %",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.osa_pct_current}
                percentValue={params.row.osa_pct_change}
            />
        ),
    },

    // 🔻 Hidden (previous data fields)
    { field: "ad_spend_previous", headerName: "AD SPEND PREV", hide: true },
    { field: "views_previous", headerName: "VIEWS PREV", hide: true },
    { field: "direct_units_sold_previous", headerName: "UNITS SOLD PREV", hide: true },
    { field: "direct_revenue_previous", headerName: "REVENUE PREV", hide: true },
    { field: "roas_previous", headerName: "ROAS PREV", hide: true },
    { field: "cvr_previous", headerName: "CVR PREV", hide: true },
    { field: "osa_pct_previous", headerName: "OSA PREV", hide: true },

    // 🔻 Hidden (change-only fields)
    { field: "ad_spend_change", headerName: "AD SPEND CHANGE", hide: true },
    { field: "views_change", headerName: "VIEWS CHANGE", hide: true },
    { field: "direct_units_sold_change", headerName: "UNITS SOLD CHANGE", hide: true },
    { field: "direct_revenue_change", headerName: "REVENUE CHANGE", hide: true },
    { field: "roas_change", headerName: "ROAS CHANGE", hide: true },
    { field: "cvr_change", headerName: "CVR CHANGE", hide: true },
    { field: "osa_pct_change", headerName: "OSA CHANGE", hide: true },
];

const ProductAnalyticsDatatable = () => {

    const { dateRange, formatDate } = useContext(overviewContext)

    const [productAnalyticsData, setProductAnalyticsData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const getProductAnalyticsData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setProductAnalyticsData({});
        setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            setIsLoading(false);
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);

        try {
            const response = await fetch(`https://react-api-script.onrender.com/samsonite/product-analytics?platform=${operator}&start_date=${startDate}&end_date=${endDate}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setProductAnalyticsData(data || {});
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch product analytics data:", error.message);
                setProductAnalyticsData({});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const abortControllerRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            getProductAnalyticsData();
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange]);

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <React.Fragment>
            <div className="shadow-box-con-keywords aggregated-view-con">
                <div className="datatable-con-product-analytics">
                    <MuiDataTableComponent
                        isLoading={isLoading}
                        isExport={true}
                        columns={ProductAnalyticsColumnFlipkart}
                        data={productAnalyticsData.data || []}
                        getRowId={(row) => row.fsn_id}
                    />
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}

export default ProductAnalyticsDatatable;