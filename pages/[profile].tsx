import { GetServerSideProps, GetServerSidePropsContext, PreviewData } from 'next';
import styles from './[profile].module.scss';
import { FormEventHandler, useState } from 'react';
import client from '../core/graphql/client';
import { gql, useMutation } from '@apollo/client';
import classNames from 'classnames';
import Head from 'next/head';
import aaa from 'next/'
import Image from 'next/image';

const SEND_QUESTION_MUTATION = gql`
	mutation sendQuestion($recipient: String!, $content: String!) {
		sendQuestion(recipientID: $recipient, content: $content)
	}
`;

const TOAST_MS = 5000;

export interface ProfilePageProps {
	avatarUrl: string;
	profileID: string;
	profileTag: string;
}

export default function ProfilePage({ avatarUrl, profileID, profileTag }: ProfilePageProps) {
	const [toast, setToast] = useState(false);
	const [error, setError] = useState(true);
	const [_sendQuestion, { loading }] = useMutation(SEND_QUESTION_MUTATION);

	const sendQuestion: FormEventHandler<HTMLFormElement> = async (ev) => {
		ev.preventDefault();

		setError(false);
		setToast(false);

		const form = ev.currentTarget;
		const formData = new window.FormData(form);
		const content = formData.get('content');

		try {
			await _sendQuestion({
				variables: {
					recipient: profileID,
					content: content,
				},
			});

			form.reset();
		} catch (e) {
			setError(true);
		}

		setToast(true);

		setTimeout(() => {
			setToast(false);
			setError(false);
		}, TOAST_MS);
	};

	const onContentInput: FormEventHandler<HTMLTextAreaElement> = (ev) => {
		ev.currentTarget.style.height = 'auto';
		ev.currentTarget.style.height = ev.currentTarget.scrollHeight + 'px';
	};

	return (
		<div className={styles.root}>
			<Head>
				<title>{profileTag} - Sinope Ask</title>
				<link rel="icon" href={avatarUrl} />
			</Head>
			<form onSubmit={sendQuestion} className={styles.form}>
				<div className={styles.questionBox}>
					<img className={styles.avatar} src={avatarUrl} alt="Avatar" />
					<textarea
						name="content"
						placeholder="Ask me anything..."
						className={styles.input}
						onInput={onContentInput}
						required
					/>
				</div>
				<div className={styles.lowerWrapper}>
					<button type="submit" className={styles.send} disabled={loading}>
						<svg className={styles.sendIcon} viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22 5.5H9C7.9 5.5 7 6.4 7 7.5V16.5C7 17.61 7.9 18.5 9 18.5H22C23.11 18.5 24 17.61 24 16.5V7.5C24 6.4 23.11 5.5 22 5.5M22 16.5H9V9.17L15.5 12.5L22 9.17V16.5M15.5 10.81L9 7.5H22L15.5 10.81M5 16.5C5 16.67 5.03 16.83 5.05 17H1C.448 17 0 16.55 0 16S.448 15 1 15H5V16.5M3 7H5.05C5.03 7.17 5 7.33 5 7.5V9H3C2.45 9 2 8.55 2 8S2.45 7 3 7M1 12C1 11.45 1.45 11 2 11H5V13H2C1.45 13 1 12.55 1 12Z"
							/>
						</svg>
					</button>
					<div className={styles.toastWrapper}>
						<div
							className={classNames({
								[styles.toast]: true,
								[styles.toastShow]: toast && !error,
							})}
						>
							<svg className={styles.toastIcon} viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
								/>
							</svg>
							<span>Sent!</span>
						</div>
						<div
							className={classNames({
								[styles.toast]: true,
								[styles.toastShow]: toast && error,
								[styles.toastErr]: true,
							})}
						>
							<svg className={styles.toastIcon} viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
								/>
							</svg>
							<span>Unexpected error</span>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async ({ params }: GetServerSidePropsContext<{profile: string}, PreviewData>) => {
	const { profile } = params;

	try {
		const { data, errors, error } = await client.query<{profile: {avatar: string, ID: string}}>({
			query: gql`
				query Profile($profileTag: String!) {
					profile(tag: $profileTag) {
						avatar
						ID
					}
				}
			`,
			variables: {
				profileTag: profile,
			},
		});

		return { props: { avatarUrl: data.profile.avatar, profileID: data.profile.ID, profileTag: profile } };
	} catch (e) {
		console.log(e);
		return { notFound: true };
	}
};
