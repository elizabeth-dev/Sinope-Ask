import { GetServerSideProps } from 'next';
import styles from './[profile].module.scss';
import { FormEventHandler } from 'react';
import client from '../core/graphql/client';
import { gql, useMutation } from '@apollo/client';

const SEND_QUESTION_MUTATION = gql`
	mutation sendQuestion($recipient: String!, $content: String!) {
		sendQuestion(recipientID: $recipient, content: $content)
	}
`;

export interface ProfilePageProps {
	avatarUrl: string;
	profileID: string;
}

export default function ProfilePage({ avatarUrl, profileID }: ProfilePageProps) {
	const [_sendQuestion, { loading }] = useMutation(SEND_QUESTION_MUTATION);

	const sendQuestion: FormEventHandler<HTMLFormElement> = (ev) => {
		ev.preventDefault();

		const form = ev.currentTarget;
		const formData = new window.FormData(form);
		const content = formData.get('content');
		form.reset();

		_sendQuestion({
			variables: {
				recipient: profileID,
				content: content,
			},
		});
	};

	const onContentInput: FormEventHandler<HTMLTextAreaElement> = (ev) => {
		ev.currentTarget.style.height = 'auto';
		ev.currentTarget.style.height = ev.currentTarget.scrollHeight + 'px';
	};

	return (
		<div className={styles.root}>
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
				<button type="submit" className={styles.send} disabled={loading}>
					<svg className={styles.sendIcon} viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22 5.5H9C7.9 5.5 7 6.4 7 7.5V16.5C7 17.61 7.9 18.5 9 18.5H22C23.11 18.5 24 17.61 24 16.5V7.5C24 6.4 23.11 5.5 22 5.5M22 16.5H9V9.17L15.5 12.5L22 9.17V16.5M15.5 10.81L9 7.5H22L15.5 10.81M5 16.5C5 16.67 5.03 16.83 5.05 17H1C.448 17 0 16.55 0 16S.448 15 1 15H5V16.5M3 7H5.05C5.03 7.17 5 7.33 5 7.5V9H3C2.45 9 2 8.55 2 8S2.45 7 3 7M1 12C1 11.45 1.45 11 2 11H5V13H2C1.45 13 1 12.55 1 12Z"
						/>
					</svg>
				</button>
			</form>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async ({ params }) => {
	const { profile } = params;

	try {
		const { data, errors, error } = await client.query({
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

		return { props: { avatarUrl: data.profile.avatar, profileID: data.profile.ID } };
	} catch (e) {
		return { notFound: true };
	}
};
