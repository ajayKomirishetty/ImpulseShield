import React from 'react';
import { View, StyleSheet } from 'react-native';
import { InvestmentItem } from './InvestmentItem';
import { Investment } from '@/stores/RootStore';

interface AssetListProps {
    portfolio: Investment[];
}

export const AssetList: React.FC<AssetListProps> = ({ portfolio }) => {
    return (
        <View style={styles.listContainer}>
            {portfolio.map((item, index) => (
                <InvestmentItem key={item.ticker} item={item} index={index} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        gap: 12,
    },
});
