import React from 'react';
import LegalLayout from '@/components/LegalLayout';

export default function CommercialLawPage() {
    return (
        <LegalLayout title="特定商取引法に基づく表記" lastUpdated="2026年1月19日">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700 w-1/3">
                                販売業者
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                MisePo（運営：[運営会社名を記載]）
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                運営責任者
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                [運営責任者名を記載]
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                所在地
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                〒[000-0000]<br />
                                [都道府県市区町村番地 建物名など]
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                電話番号
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                [電話番号を記載]<br />
                                <span className="text-xs text-gray-500">※お電話でのお問い合わせは受け付けておりません。メールにてお問い合わせください。</span>
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                メールアドレス
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                support@misepo.com
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                販売URL
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                https://misepo.com
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                商品代金
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                Proプラン：月額 1,480円（税込）
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                商品代金以外の必要料金
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                インターネット接続料金、通信料金等はお客様の負担となります。
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                お支払方法
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                クレジットカード決済（Stripe）
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                代金の支払時期
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                初回申込時および毎月の更新日に決済されます。
                                <br />
                                ※7日間の無料トライアル期間中は料金が発生しません。
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                商品の引渡時期
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                決済完了後、直ちにご利用いただけます。
                            </td>
                        </tr>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-bold text-gray-700">
                                解約・返品について
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <p className="mb-2"><strong>解約について</strong><br />
                                    マイページの設定画面より、いつでも解約手続きを行うことができます。次回更新日の前日までに解約手続きを行っていただければ、次回以降の請求は発生しません。
                                </p>
                                <p><strong>返品・返金について</strong><br />
                                    デジタルコンテンツの性質上、決済完了後の返品・返金には応じられません。予めご了承ください。
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p>※上記記載内容につきましては、情報等の開示請求があった場合、遅滞なく開示いたします。</p>
            </div>
        </LegalLayout>
    );
}
