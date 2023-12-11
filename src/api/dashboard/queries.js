const getMostPopularStyle = `
SELECT
    s.id AS style_id,
    s.name AS style_name,
    s.color AS style_color,
    COUNT(oqr.qr_single_id) AS qr_count
FROM
    styles s
JOIN
    qr_singles qs ON s.id = qs.style_id
LEFT JOIN
    order_qr_code_relations oqr ON qs.id = oqr.qr_single_id
GROUP BY
    s.id, s.name
ORDER BY
    qr_count DESC
LIMIT 10;
`;

const getZeroInventoryStyles = `
SELECT
    s.id AS style_id,
    s.name AS style_name,
    s.color AS style_color
FROM
    styles s
WHERE
    EXISTS (
        SELECT 1
        FROM
            qr_singles qr
        JOIN
            order_qr_code_relations oq ON qr.id = oq.qr_single_id
        JOIN
            orders o ON oq.order_id = o.id
        WHERE
            qr.style_id = s.id
            AND o.checkout_date IS NOT NULL
            AND o.checkin_date IS NULL
    );
`;

const numberOfCheckedOutSamples = `
SELECT COUNT(DISTINCT qr.id)
FROM qr_singles qr
JOIN order_qr_code_relations oq ON qr.id = oq.qr_single_id
JOIN orders o ON oq.order_id = o.id
WHERE o.checkout_date IS NOT NULL AND o.checkin_date IS NULL;
`;

module.exports = {
  getMostPopularStyle,
  getZeroInventoryStyles,
  numberOfCheckedOutSamples,
};
